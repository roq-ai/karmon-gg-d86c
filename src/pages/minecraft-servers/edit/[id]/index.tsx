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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMinecraftServerById, updateMinecraftServerById } from 'apiSdk/minecraft-servers';
import { Error } from 'components/error';
import { minecraftServerValidationSchema } from 'validationSchema/minecraft-servers';
import { MinecraftServerInterface } from 'interfaces/minecraft-server';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function MinecraftServerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MinecraftServerInterface>(
    () => (id ? `/minecraft-servers/${id}` : null),
    () => getMinecraftServerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MinecraftServerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMinecraftServerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/minecraft-servers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MinecraftServerInterface>({
    initialValues: data,
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
            Edit Minecraft Server
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(MinecraftServerEditPage);
