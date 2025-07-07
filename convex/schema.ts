import {defineSchema,defineTable} from "convex/server"
import {v} from "convex/values"

/**
 * This is the schema for the documents table on convex.
 */
export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean()
    })
    .index("by_user", ["userId"])
    .index("bu_user_parent", ["userId", "parentDocument"])
})