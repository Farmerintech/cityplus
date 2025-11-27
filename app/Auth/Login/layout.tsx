import type {Metadata} from "next";


export const metadata:Metadata= {
  title: "Jami | Login",
};

export default function PageMetadata ({children}:any){
    return <>{children}</>
}