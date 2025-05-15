import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface QuestionProps {
  label: string;
  id: string;
  type: 'text' | 'select' | 'multi-select';
  options?: string[]; // For 'select' or 'multi-select'
  placeholder?: string; // For 'text'
  register: UseFormRegister<any>;
  errors: Record<string, any>;
}

const Question: React.FC<QuestionProps> = ({ label, id, type, options, placeholder, register, errors }) => {
  const [showAdditionalInput, setShowAdditionalInput] = React.useState(false);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement  >) => {
    const selectedValue = event.target.value;
    if (selectedValue.includes('please specify') || selectedValue.includes('describe') || selectedValue.includes('elaborate')) {
      setShowAdditionalInput(true);
    } else {
      setShowAdditionalInput(false);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const value = event.target.value;
    if (value.includes('please specify')) {
      setShowAdditionalInput(isChecked);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id.toString()} className="block text-sm font-semibold text-black-500">
        {label}
      </label>

      {/* Text Input */}
      {type === 'text' && (
        <input
          type="text"
          id={id.toString()}
          {...register(id.toString())}
          className={`mt-1 block w-full border-[#DBDCDE] shadow-sm bg-[#F4F5F9] p-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
            errors[id.toString()] ? 'border-red-500' : ''
          }`}
          placeholder={placeholder}
        />
      )}

      {/* Select Input */}
      {type === 'select' && options && (
        <>
          <select                                                 
            id={id.toString()}
            {...register(id.toString())}
            onChange={handleSelectChange}
            className={`mt-1 block w-full border-[#DBDCDE] shadow-sm bg-[#F4F5F9] p-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
              errors[id.toString()] ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select an option...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Additional Input */}
          {showAdditionalInput && (
            <input 
              type="text"
              id={`${id.toString()}-additional`}
              {...register(`${id.toString()}-additional`)}
              className="mt-2 block w-full border-[#DBDCDE] shadow-sm bg-[#F4F5F9] p-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              placeholder="Please specify"
            />
          )}
        </>
      )}

      {/* Multi-Select Input */}
      {type === 'multi-select' && options && (
        <div className="mt-1">
          {options.map((option, index) => (
            <label key={index} className="block">
              <input
                type="checkbox"
                value={option}  
                {...register(id.toString())}
                onChange={ handleCheckboxChange }
                className="mr-2"
              />
              {option}
            </label>
          ))}
           {showAdditionalInput && (
          <input
            type="text"
            id={`${id.toString()}-additional`}
            {...register(`${id.toString()}-additional`)}
            className="mt-2 block w-full border-[#DBDCDE] shadow-sm bg-[#F4F5F9] p-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="Please specify"
          />
        )}
        </div>      
      )}

      {/* Error and Success Feedback */}
      {errors[id.toString()] && (
        <p className="text-red-500 text-sm">{errors[id.toString()].message}</p>
      )}
    </div>
  );
};

export default Question;