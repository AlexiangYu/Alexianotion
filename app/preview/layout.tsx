const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full dark:bg-[#1f1f1f]">
            {children}
        </div>
    )
}

export default PublicLayout