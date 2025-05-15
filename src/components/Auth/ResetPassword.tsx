import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forget_password, logo } from "../../../public";
import Textinput from "../Ui/Textinput";
import Button from "../Ui/Button";
import { Link, useLocation } from "react-router-dom";
import UserAuthentication from "@/hooks/UseAuth";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Define the validation schema using yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "OTP must be at least 4 characters")
    .max(6, "OTP cannot exceed 6 characters"),
  new_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  new_password_confirmation: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

// Define the form values interface
interface FormValues {
  email: string;
  otp: string;
  new_password: string;
  new_password_confirmation: string;
}

const ResetPassword = () => {
  const { ResetForgetPwd } = UserAuthentication();
  const [isLoading] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // Get email from state or query parameters
    const emailFromState = location.state?.email;
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location]);
  
  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      email: email,
    }
  });
  
  // Set email value when it changes
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  // Handler for form submission
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    toast.promise(
      await ResetForgetPwd(data),
        {
            pending: "Changing password...",
            success: {
            render({ data }) {
                return <div>{data as string}</div>;
            }
            },
            error: {
            render({ data }) {
                return <div>{data as string}</div>;
            }
            }
        }
    );
  };
  
  return (
    <div className="w-[100%] bg-white flex justify-start md:items-start items-center">
      <div className="md:w-1/2 w-full h-[100vh] justify-center md:justify-start flex flex-col items-start md:px-[10%] px-[7%] gap-5 pt-[2%]">
        <div className="pt-5">
          <img src={logo} alt="logo" width={300} height={200} />
        </div>
        <div className="space-y-3 pt-[10%]">
          <h1 className="font-bold text-4xl">Reset Your Password</h1>
          <p className="text-gray-500">Enter the OTP sent to your email and create a new password</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] space-y-4">
          <Textinput
            type="email"
            label="Email Address"
            className="h-16 w-full"
            placeholder="Enter your email"
            register={register}
            name="email"
            error={errors.email}
            validate={
              !errors.email && touchedFields.email
                ? "Correct! email is valid"
                : undefined
            }
            readOnly={!!email}
          />
          
          <Textinput
            type="text"
            label="OTP Code"
            className="h-16 w-full"
            placeholder="Enter OTP sent to your email"
            register={register}
            name="otp"
            error={errors.otp}
          />
          
          <Textinput
            type="password"
            label="New Password"
            className="h-16 w-full"
            placeholder="Enter new password"
            register={register}
            name="new_password"
            error={errors.new_password}
          />
          
          <Textinput
            type="password"
            label="Confirm Password"
            className="h-16 w-full"
            placeholder="Confirm your new password"
            register={register}
            name="new_password_confirmation"
            error={errors.new_password_confirmation}
          />
          
          <p>
            <Link to={"/auth/signin"} className="text-blue-800 font-bold">
              Back to login
            </Link>
          </p>

          <div className="w-full md:mt-auto mt-5 md:mb-[10%]">
            <Button
              className="flex items-center py-3 w-full justify-center mx-auto rounded-md"
              text="Reset Password"
              isLoading={isLoading}
              type="submit"
            />
          </div>
        </form>
      </div>

      <div className="relative hidden md:flex w-1/2 rounded-xl items-center">
        <img
          src={forget_password}
          width={550}
          height={500}
          alt="side image"
          className="object-contain absolute left-0"
        />
        <div className="w-[25%] bg-white h-screen"></div>
        <div className="w-[75%] bg-primary h-screen"></div>
      </div>
    </div>
  );
};

export default ResetPassword;