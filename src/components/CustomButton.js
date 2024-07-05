
import {motion} from 'framer-motion';

const CustomButton = ({className,color,icon,text,onClick,disabled=false})=>{

    const colorClasses = {
        blue: "bg-blue-200 hover:bg-blue-300 text-blue-900",
        red: "bg-red-200 hover:bg-red-300 text-red-900",
        green: "bg-green-200 hover:bg-green-300 text-green-900",
        yellow: "bg-yellow-200 hover:bg-yellow-300 text-yellow-800",
        orange: "bg-orange-200 hover:bg-orange-300 text-orange-900",

      };

    return(
        <motion.button
                className={`flex items-center mr-2 ${colorClasses[color]} ${className} font-semibold py-2 px-4 rounded-lg shadow-md`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                disabled={disabled}
              >
                {icon}
                <span className="ml-2">{text}</span>
              </motion.button>
    )
}

export default CustomButton;