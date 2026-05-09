const AuthCard = ({children, className} : {children: React.ReactNode, className?: string}) => {
  return (
    <div className={`w-[90%] md:w-100 flex flex-col rounded-md shadow-2xl text-text-primary ${className}`}>
        {children}
    </div>
  )
}

export default AuthCard