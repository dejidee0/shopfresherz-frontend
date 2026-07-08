const AuthCard = ({children, className} : {children: React.ReactNode, className?: string}) => {
  return (
    <div className={`w-[90%] max-w-[420px] flex flex-col text-[#111111] ${className ?? ''}`}>
        {children}
    </div>
  )
}

export default AuthCard
