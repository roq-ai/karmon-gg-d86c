import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMinecraftServer } from 'apiSdk/minecraft-servers';
import { Error } from 'components/error';
import { minecraftServerValidationSchema } from 'validationSchema/minecraft-servers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { MinecraftServerInterface } from 'interfaces/minecraft-server';

function MinecraftServerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MinecraftServerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMinecraftServer(values);
      resetForm();
      router.push('/minecraft-servers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MinecraftServerInterface>({
    initialValues: {
      ip_address: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: minecraftServerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Minecraft Server
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="ip_address" mb="4" isInvalid={!!formik.errors?.ip_address}>
            <FormLabel>Ip Address</FormLabel>
            <Input type="text" name="ip_address" value={formik.values?.ip_address} onChange={formik.handleChange} />
            {formik.errors.ip_address && <FormErrorMessage>{formik.errors?.ip_address}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'minecraft_server',
    operation: AccessOperationEnum.CREATE,
  }),
)(MinecraftServerCreatePage);
