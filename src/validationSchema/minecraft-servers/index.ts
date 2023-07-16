import * as yup from 'yup';

export const minecraftServerValidationSchema = yup.object().shape({
  ip_address: yup.string().required(),
  company_id: yup.string().nullable(),
});
