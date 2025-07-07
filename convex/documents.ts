import {v} from "convex/values"

import {mutation, query} from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

/**
 * 获取所有测试
 */
export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const documents = await ctx.db.query("documents").collect()
        return documents
    }
})
/**
 * 获取侧边栏
 */
export const getSidebar = query({
    args: {
        parentDocument:v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const documents = await ctx.db
            .query("documents")
            .withIndex("bu_user_parent", q => q.eq("userId", userId).eq("parentDocument", args.parentDocument))
            .filter(q => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect()
        return documents
    }
})

/**
 * 创建文档
 */
export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")        
        
        const userId = identity.subject
        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        })
        return document
    }
})

/**
 * 删除（标记为archived）
 */
export const archive = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")
        
        const recursiveArchive = async (documentId: Id<"documents">) => {   // 对文件递归存档操作
            const children = await ctx.db
                .query("documents")
                .withIndex("bu_user_parent", (q) => q
                    .eq("userId",userId)
                    .eq("parentDocument",documentId))
                .collect()
            
            for(const child of children) {  // forEach 不支持异步操作，所以用 for 循环
                await ctx.db.patch(child._id, {isArchived: true})
                await recursiveArchive(child._id)
            }
        }
        const document = await ctx.db.patch(args.id, {isArchived: true})
        
        recursiveArchive(args.id)
        return document
    }
})

/**
 * 获取回收站
 */
export const getTrash = query({
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter(q => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect()

        return documents
    }
})

/**
 * 恢复
 */
export const restore = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")
        
        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("bu_user_parent", q => q
                    .eq("userId",userId)
                    .eq("parentDocument",documentId))
                .collect()
            for(const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false
                })
                await recursiveRestore(child._id)
            }
        }
        const options: Partial<Doc<"documents">> = {
            isArchived: false
        }
        // 只能恢复上一级
        if(existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument)
            if(parent?.isArchived)
                options.parentDocument = undefined
        }
        await ctx.db.patch(args.id, options)
        return existingDocument
    }
})

/**
 * 删除
 */
export const remove = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")

        const recursiveRemove = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("bu_user_parent", (q) => q
                    .eq("userId", userId)
                    .eq("parentDocument", documentId))
                .collect()
            for(const child of children) {
                await ctx.db.delete(args.id)
                await recursiveRemove(child._id)
            }
        }
        const document = await ctx.db.delete(args.id)
        recursiveRemove(args.id)
        return document
    }
})

/**
 * 搜索
 */
export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", q => q.eq("userId", userId))
            .filter(q => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect()
        
        return documents
    }
})

/**
 * 获取某个文档
 */
export const getById = query({
    args: {
        documentId: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        const document = await ctx.db.get(args.documentId)
        if(!document)
            throw new Error("Not found")
        
        if(document.isPublished && !document.isArchived)
            return document
        
        if(!identity)
            throw new Error("Not authenticated")
        
        const userId = identity.subject
        if(document.userId !== userId)
            throw new Error("Unauthorized")
        
        return document
    }
})

/**
 * 更新文档
 */
export const update = mutation({
    args: {
        id:v.id("documents"),
        title:v.optional(v.string()),
        content:v.optional(v.string()),
        isPublished:v.optional(v.boolean()),
        coverImage:v.optional(v.string()),
        icon:v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        const userId = identity?.subject
        const {id, ...rest} = args
        const existingDocument = await ctx.db.get(id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")
        
        const document = await ctx.db.patch(id,rest)
        return document
    }
})


/**
 * 删除图标
 */
export const removeIcon = mutation({
    args: {
        id:v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        const userId = identity?.subject
        const {id, ...rest} = args
        const existingDocument = await ctx.db.get(id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")
        
        const document = await ctx.db.patch(id, {icon:undefined})
        return document
    }
})

/**
 * 删除封面
 */
export const removeCoverImage = mutation({
    args:{
        id:v.id("documents"),
    },
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()
        const userId = identity?.subject
        const {id,...rest} = args
        const existingDocument = await ctx.db.get(id)
        if(!existingDocument)
            throw new Error("Not found")
        
        if(existingDocument.userId !== userId)
            throw new Error("Unauthorized")
        
        const document = await ctx.db.patch(id,{coverImage:undefined})
        return document
    }
})