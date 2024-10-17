import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forget_password, logo } from "../../../public";
import Textinput from "../Ui/Textinput";

import Button from "../Ui/Button";


// Define the validation schema using yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

// Define the form values interface
interface FormValues {
  email: string;
}

const ForgetPassword = () => {

  const {
    register,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // Handler for form submission
  // const onSubmit: SubmitHandler<FormValues> = (data) => {
  //   console.log(data);
  // };
  return (
    <div className=" w-[100%] bg-white  flex justify-start md:items-start items-center">
      <div className=" md:w-1/2 w-full h-[100vh] justify-center md:justify-start flex flex-col items-start md:px-[10%] px-[7%]   gap-5  pt-[2%] ">
        <div className="pt-5">
          <img src={logo} alt="logo" width={300} height={200} />
        </div>
        <div className="space-y-3 pt-[20%]">
          <h1 className=" font-bold text-4xl">Enter your E-mail to continue</h1>
          <h1 className=" font-medium text-gray-500 text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </h1>
        </div>
        <div className=" w-[100%]   space-y-4">
          <Textinput
            type="email"
            label="Email Address"
            className="h-16 w-full "
            placeholder="Enter your email"
            register={register}
            name="email"
            error={errors.email}
            validate={
              !errors.email && touchedFields.email
                ? "Correct! email is valid"
                : undefined
            }
          />
        </div>
        <div className="w-full md:mt-auto mt-5 md:mb-[10%]">
          <Button
            className="flex items-center py-3 w-full justify-center mx-auto rounded-md"
            text="Continue"
            isLoading={false}
          />
        </div>
      </div>

      <div className=" relative  hidden md:flex w-1/2   rounded-xl  items-center">
        <img
          src={forget_password}
          width={550}
          height={500}
          alt="side image"
          className=" object-contain absolute  left-0 "
        />

        <div className="w-[25%] bg-white h-screen "></div>
        <div className="w-[75%] bg-primary h-screen "></div>
      </div>
    </div>
  );
};

export default ForgetPassword;
