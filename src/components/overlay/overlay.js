export const Overlay = ({children}) => {
    return (
        <>
            <div className="overlay position-absolute top-0 start-0 bottom-0 end-0 bg-white"></div>
            <div
                className="text-center position-absolute z-2 top-50 start-50 translate-middle fs-5">{children}
            </div>
        </>
    )
}