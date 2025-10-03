/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-return-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
import { validateAll, extend } from 'indicative/validator';
import { getValue } from 'indicative-utils';
import validator from 'validator';
import moment from 'moment';

extend('isEmail', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.isEmail(fieldValue);
    }
});

extend('isAlphanumeric', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.matches(fieldValue, `^[a-zA-Z0-9-_'@,.~ ]+$`);
    }
});

extend('isMobilePhone', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.isMobilePhone(fieldValue, 'en-US');
    }
});

extend('isCreditCard', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.isCreditCard(fieldValue);
    }
});

extend('isURL', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.isURL(fieldValue, { protocols: ['https'], require_protocol: true, require_host: true });
    }
});

extend('noSpecialCharacters', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return !specialChars.test(fieldValue);
    }
});

extend('isValidDate', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        return validator.isDate(fieldValue['yyyy-MM-DD HH:mm']);
    }
});
// if (Date.parse(`${new Date()}`) > Date.parse(formData?.dropoff_time)) {
//     setState({
//         alertMessage: { type: 'error', message: 'Drop off date should be a future date' }
//     });
//     passValidation = false;
// }
extend('isValidDateAndFutureDate', {
    async: true,
    /**
     * @param {*} args
     * @returns {args} args
     */
    compile(args: any) {
        return args;
    },

    /**
     * @param {*} data data object
     * @param {*} field fields
     * @returns {Boolean} bool
     */
    async validate(data: any, field: any) {
        const fieldValue = getValue(data, field);
        const passValidation = false;
        if (moment(fieldValue).isValid()) {
            return Date.parse(`${new Date()}`) < Date.parse(fieldValue);
        }
        return passValidation;
    }
});

/**
 * Method to validate form data
 * @param {*} data
 * @param {*} rules
 * @param {*} messages
 * @returns {object} error
 */
// eslint-disable-next-line import/prefer-default-export
export const validateData = async (data: object, rules: any, messages: any, removeAdditional = false) =>
    validateAll(data, rules, messages, { removeAdditional })
        .then(() => ({}))
        .catch((errors) => {
            const formattedErrors: any = {};

            errors.forEach((error: any) => (formattedErrors[error.field] = error.message));

            return formattedErrors;
        });
