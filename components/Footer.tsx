import { VFC } from "react";
import FadeIn from "./FadeIn";

const Footer: VFC = () => {
    return(
        <FadeIn>
            <footer className="text-center mt-24 fadeIn-deley">
                &copy;akio.com.ac.jp
            </footer>
        </FadeIn>
    )
}

export default Footer