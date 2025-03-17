import { AuthLayout } from "../Layout/layout";
import EduCard from "./Tool/EduCard";

const Education = () => {
    return (
        <AuthLayout>
            <>
                <div className="px-8 ">
                    <h1 className="text-base ">Let help you get better with our various courses, from beginner to becoming professional in any field you find yourself </h1>
                    <h1 className="text-base">Start by choosing your desired course </h1>
               <div className="my-5">
                <EduCard />
               </div>
                </div>
            </>
        </AuthLayout>
    );
};

export default Education;
