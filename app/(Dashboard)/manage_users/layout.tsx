import type {Metadata} from "next";


export const metadata:Metadata= {
  title: "Jami | Manage Users",
};

export default function PageMetadata ({children}:any){
    return <>{children}</>
}