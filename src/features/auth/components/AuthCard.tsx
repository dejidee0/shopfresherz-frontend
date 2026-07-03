const AuthCard = ({children, className} : {children: React.ReactNode, className?: string}) => {
  return (
    <div className={`w-[90%] max-w-[420px] flex flex-col text-white ${className ?? ''}`}>
        {children}
    </div>
  )
}

export default AuthCard
