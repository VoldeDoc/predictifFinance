import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KycData } from "@/types";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";

const KycForm = () => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = Yup.object({
    documentType: Yup.string().required('Please select a document type'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentFile(file);
      
      // Create preview URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setDocumentPreview(fileUrl);
    }
  };

  const onSubmit: SubmitHandler<{ documentType: string }> = async (data) => {
    if (!documentFile) {
      toast.error("Please upload a document");
      return;
    }

    setIsLoading(true);
    
    const kycData: KycData = {
      kyc: [
        {
          type: 'text',
          key: 'label',
          value: data.documentType
        },
        {
          type: 'file',
          key: 'detail',
          value: documentFile
        }
      ]
    };

    toast.promise(
      // Replace with your actual API call
      new Promise((resolve) => {
        console.log('KYC data to be submitted:', kycData);
        setTimeout(resolve, 1500);
      }),
      {
        pending: "Submitting KYC information...",
        success: {
          render() {
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000);
            return "KYC submitted successfully!";
          }
        },
        error: "Failed to submit KYC information"
      }
    ).finally(() => {
      setIsLoading(false);
      reset();
      setDocumentFile(null);
      setDocumentPreview(null);
    });
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Section (Form) */}
      <div className="bg-gray-100 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/assets/images/logo.png"
            alt="Predict.if Logo"
            className="w-60 mx-auto mb-20"
          />

          {/* Title */}
          <h1 className="text-4xl font-semibold text-center mb-10">
            KYC Verification
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Document Type Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                {...register('documentType')}
                className={`w-full p-3 pl-5 border ${
                  errors.documentType && touchedFields.documentType ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select document type</option>
                <option value="ID Card">ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
              </select>
              {errors.documentType && touchedFields.documentType && (
                <p className="text-red-500 text-sm mt-1">{errors.documentType?.message}</p>
              )}
            </div>
            
            {/* Document Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Document
              </label>
              <div className={`border-2 border-dashed ${documentFile ? 'border-blue-500' : 'border-gray-300'} rounded-md p-6 hover:border-blue-400 transition-colors`}>
                <div className="space-y-2 text-center">
                  {!documentPreview ? (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex justify-center text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG, JPEG, PNG up to 10MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      {documentFile?.type.startsWith('image/') ? (
                        <div className="w-full max-h-48 overflow-hidden mb-3">
                          <img 
                            src={documentPreview} 
                            alt="Document preview" 
                            className="mx-auto max-h-48 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-blue-50 rounded-md mb-3">
                          <p className="text-blue-800 font-medium">
                            {documentFile?.name}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentFile(null);
                          setDocumentPreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!documentFile && touchedFields.documentType && (
                <p className="text-red-500 text-sm mt-1">Please upload a document</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 mt-5 rounded-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit KYC'}
            </button>
          </form>
        </div>
        
        {/* Privacy and Terms */}
       
      </div>

      {/* Right Section (Brand Image) */}
      <div className="hidden sm:flex bg-blue-500 sm:w-1/2 flex-col justify-center items-center p-10">
        <img src="/assets/images/auth/ip1.png" alt="" className="w-56"/>
      </div>
    </div>
  );
};

export default KycForm;