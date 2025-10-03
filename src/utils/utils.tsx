/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-cond-assign */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */



/**
 * Checks if an array is empty
 * @param {Array} arr Array to be tested
 * @returns {Boolean} Boolean value
 */
export const isArrayEmpty = (arr: any) => Array.isArray(arr) && arr.length === 0;

/**
 * Checks if an object has no set properties
 * @param {*} obj The object to test
 * @returns {*} boolean
 */
export const isObjectEmpty = (obj = {}) => !obj || Object.keys(obj).length === 0;

// /**
//  * Ensure that a given string matches the character count and ellipsized at that point
//  * @param {String} text Target text
//  * @param {Number} numChars Number of characters needed
//  * @returns {String} Truncated text
//  */
export const truncateMultilineText = (text: string, numChars: number) => {
    if (!text) return '';

    // Because '...' will be appended to long strings,
    // this ensures that the entire character count is as specified
    const maxStringLength = numChars - 3;

    return maxStringLength > text.length ? text : `${text.trim().substring(0, maxStringLength)}...`;
};

/**
 * Function that does nothing:
 * Useful as a default value for an optional Component prop
 * that's of type - function
 * Or for stubbing function calls in Tests and Storybook Docs
 * @returns {*} undefined
 */
export const noOp = () => {};

// /**
//  * Method to Extract initials from Full name
//  * @param {string} name name
//  * @returns {string} initials
//  */
export const getInitials = (name = ' ') => {
    const fullName = name.split(' ');
    const initials = fullName[0].substring(0, 1).toUpperCase();

    if (fullName.length > 1) {
        initials.concat(fullName[fullName.length - 1].substring(0, 1).toUpperCase());
    }

    return initials;
};

export const scrollTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const scrollDown = () => {
    window.scrollTo({
        // bottom:0,
        behavior: 'smooth'
    });
};
/**
 * Checks if an array is empty
 * @param {Array} arr Array to be tested
 * @returns {Boolean} Boolean value
 */
export const isNotEmptyArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

export const changeNumberToArrayList = (number: any) => Array.from(Array(number).keys());

export const capitalizeFirstLetter = (string = '') => {
    if (typeof string === 'string') return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    return string;
};

export const extractFirstLetter = (string = '') => {
    if (string) {
        return string.charAt(0).toUpperCase();
    }

    return string;
};


export const replaceSpace = (str = '_') =>
    // Empty
    str.split(' ').join('');

/**
 * Method to extract error message from error response object
 * @returns {*} The error messgae
 */
export const extractErrorMessage = (err: any) => {
    const errResponse = err.response || null;
    let errorMessage = '';
    if (!errResponse) return 'Something went Wrong. Please try again';
    if (errResponse.data && errResponse.data.message) {
        let msg = '';
        if (!isObjectEmpty(errResponse.data.message)) {
            for (const key in errResponse.data.message) {
                if (Object.hasOwnProperty.call(errResponse.data.message, key)) {
                    const element = errResponse.data.message[key];
                    if (isNotEmptyArray(element)) {
                        msg += `${[...element]}`;
                    } else {
                        msg += element;
                    }
                }
            }
            return msg;
        }
        errorMessage =
            errResponse === null
                ? 'Something went Wrong. Please try again'
                : errResponse && errResponse.data && errResponse.data.message
                ? errResponse.data.message
                : 'Something went Wrong. Please try again';
    }

    return errorMessage;
};

export const validateImage = (file: any): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/x-icon', 'image/svg+xml'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }

    return true;
};

export const validateDocument = (file: any): boolean => {
    const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/msword'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }

    return true;
};
export const validateString = (str = '') => str.trim().length === 0;

export const getFileName = (file: any) => {
    const fileArray: any = file?.filePath?.split('/');
    return fileArray[fileArray?.length - 1];
};



export const findPosition = (obj: any) => {
    let currenttop = 0;
    if (obj.offsetParent) {
        do {
            currenttop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return [currenttop];
    }
    return null;
};

// CHECK IF IMAGE EXISTS
export const checkIfImageUrlIsValid = (url: string, callback: any) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
        callback(true);
    } else {
        img.onload = () => {
            callback(true);
        };

        img.onerror = () => {
            callback(false);
        };
    }
};

export function generateRandomString(length: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

export async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash);
}

export async function base64urlEncode(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePKCECodes() {
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = await base64urlEncode(hashed);
  return { codeVerifier, codeChallenge };
}


export const simulateApiCall = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "API call simulated successfully",
        data,
      });
    }, 5000); // wait for 5 seconds
  });
};

export const formatCurrency = (value: any, currency = 'NGN') =>{
  const num = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^\d.-]/g, ''));

  if (Number.isNaN(num)) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export const splitCurrency = (value: any) =>{
  const num = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^\d.-]/g, ''));

  if (Number.isNaN(num)) return { whole: '0', fraction: '00' };

  // Always keep 2 decimal places
  const [whole, fraction] = num.toFixed(2).split('.');
  return { whole, fraction };
}
