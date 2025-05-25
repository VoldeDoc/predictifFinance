import { useState } from "react";
import { KycData } from "@/types";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import UseFinanceHook from "@/hooks/UseFinance";

const KycForm = () => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { SubmitKyc, loading } = UseFinanceHook();

  const schema = Yup.object({
    documentType: Yup.string().required('Please select a document type'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const selectedDocumentType = watch('documentType');

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFrontFile(file);
      
      // Create preview URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setFrontPreview(fileUrl);
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBackFile(file);
      
      // Create preview URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setBackPreview(fileUrl);
    }
  };

  const onSubmit: SubmitHandler<{ documentType: string }> = async (data) => {
    if (!frontFile || !backFile) {
      toast.error("Please upload both front and back sides of your document");
      return;
    }

    setIsLoading(true);
    
    let frontKey, backKey;
    switch(data.documentType) {
      case "ID Card":
        frontKey = "id_card_front";
        backKey = "id_card_back";
        break;
      case "Passport":
        frontKey = "passport_front";
        backKey = "passport_back";
        break;
      case "Driver's License":
        frontKey = "driving_license_front";
        backKey = "driving_license_back";
        break;
      default:
        frontKey = "document_front";
        backKey = "document_back";
    }
    
    const kycData: KycData = {
      kyc: [
        {
          type: 'text',
          key: 'label',
          value: data.documentType
        },
        {
          type: 'file',
          key: frontKey,
          value: frontFile
        },
        {
          type: 'file',
          key: backKey,
          value: backFile
        }
      ]
    };

    try {
      await toast.promise(
        SubmitKyc(kycData),
        {
          pending: "Submitting KYC information...",
          success: "KYC submitted successfully!",
          error: {
            render({ data }) {
              return typeof data === 'string' 
                ? data 
                : "Failed to submit KYC information";
            }
          }
        }
      );
    } catch (error) {
      console.error("KYC submission error:", error);
    } finally {
      setIsLoading(false);
      reset();
      setFrontFile(null);
      setBackFile(null);
      setFrontPreview(null);
      setBackPreview(null);
    }
  };

  const getDocumentTitle = () => {
    switch(selectedDocumentType) {
      case "ID Card": return "ID Card";
      case "Passport": return "Passport";
      case "Driver's License": return "Driver's License";
      default: return "Document";
    }
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
            
            {selectedDocumentType && (
              <>
                {/* Front Document Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload {getDocumentTitle()} (Front)
                  </label>
                  <div className={`border-2 border-dashed ${frontFile ? 'border-blue-500' : 'border-gray-300'} rounded-md p-6 hover:border-blue-400 transition-colors`}>
                    <div className="space-y-2 text-center">
                      {!frontPreview ? (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex justify-center text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload front side</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleFrontFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, JPG, JPEG, PNG up to 10MB</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          {frontFile?.type.startsWith('image/') ? (
                            <div className="w-full max-h-48 overflow-hidden mb-3">
                              <img 
                                src={frontPreview} 
                                alt="Front document preview" 
                                className="mx-auto max-h-48 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="p-4 bg-blue-50 rounded-md mb-3">
                              <p className="text-blue-800 font-medium">
                                {frontFile?.name}
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setFrontFile(null);
                              setFrontPreview(null);
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove file
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!frontFile && touchedFields.documentType && (
                    <p className="text-red-500 text-sm mt-1">Please upload front side of your document</p>
                  )}
                </div>

                {/* Back Document Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload {getDocumentTitle()} (Back)
                  </label>
                  <div className={`border-2 border-dashed ${backFile ? 'border-blue-500' : 'border-gray-300'} rounded-md p-6 hover:border-blue-400 transition-colors`}>
                    <div className="space-y-2 text-center">
                      {!backPreview ? (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex justify-center text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload back side</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleBackFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, JPG, JPEG, PNG up to 10MB</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          {backFile?.type.startsWith('image/') ? (
                            <div className="w-full max-h-48 overflow-hidden mb-3">
                              <img 
                                src={backPreview} 
                                alt="Back document preview" 
                                className="mx-auto max-h-48 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="p-4 bg-blue-50 rounded-md mb-3">
                              <p className="text-blue-800 font-medium">
                                {backFile?.name}
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setBackFile(null);
                              setBackPreview(null);
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove file
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!backFile && touchedFields.documentType && (
                    <p className="text-red-500 text-sm mt-1">Please upload back side of your document</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 mt-5 rounded-md ${(isLoading || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {(isLoading || loading) ? (
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
      </div>

      {/* Right Section (Brand Image) */}
      <div className="hidden sm:flex bg-blue-500 sm:w-1/2 flex-col justify-center items-center p-10">
        <img src="/assets/images/auth/ip1.png" alt="" className="w-56"/>
      </div>
    </div>
  );
};

export default KycForm;