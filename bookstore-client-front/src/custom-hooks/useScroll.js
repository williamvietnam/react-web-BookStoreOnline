import {useState} from 'react';

export default function useScroll(offset){
    const [isScrolled, setIsScrolled] = useState(false);
    document.querySelector('body').addEventListener('scroll',function(){
        if (this.scrollTop>=offset){
            setIsScrolled(true);
        }else {
            setIsScrolled(false);
        }
    });
    return isScrolled;
}