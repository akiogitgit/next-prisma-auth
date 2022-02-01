import { ReactNode, VFC } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
    children: ReactNode
}

const SlideInLeft:VFC<Props> = ({ children }) => {
    const { ref, inView } = useInView({
        rootMargin: "-100px",
        // triggerOnce: true,
    })

    return(
        <div 
            ref={ref}
            className={`${inView ? "opacity-100" : "opacity-0 translate-x-[100px]"} duration-[1s]`}>
                {children}
            </div>
    )
}

export default SlideInLeft