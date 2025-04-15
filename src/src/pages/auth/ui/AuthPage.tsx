import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, PasswordInput, Stack, Tabs, Text, TextInput, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginUser, regUser } from '../api';

import { setToken } from '$/shared/lib/token';

const registrationFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
    surname: z.string().min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
    login: z.string().min(3, { message: 'Логин должен содержать минимум 3 символа' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  });

const loginFormSchema = z.object({
  login: z.string().min(1, { message: 'Логин не может быть пустым' }),
  password: z.string().min(1, { message: 'Пароль не может быть пустым' })
});

export type RegistrationFormType = z.infer<typeof registrationFormSchema>;
export type LoginFormType = z.infer<typeof loginFormSchema>;

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const navigate = useNavigate();
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    clearErrors: clearRegErros,
    formState: { errors: registerErrors, isValid: isRegisterValid }
  } = useForm<RegistrationFormType>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'all'
  });

  const reg = useMutation({
    mutationFn: regUser,
    onSuccess: data => {
      if (!data.token) {
        setWrongLogin('error');
        setTimeout(() => {
          setWrongLogin('');
        }, 3000);
        return;
      }
      setToken(data.token);
      navigate({
        to: '/'
      });
    }
  });
  const [wrongLogin, setWrongLogin] = useState('');
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: data => {
      if (data.error) {
        setWrongLogin('error');
        setTimeout(() => {
          setWrongLogin('');
        }, 3000);
        return;
      }
      setToken(data?.token || '');
      navigate({
        to: '/'
      });
    }
  });

  const handleRegisterSubmit = (data: RegistrationFormType) => {
    reg.mutate({
      login: data.login,
      name: data.name,
      surname: data.surname,
      password: data.password
    });
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    clearErrors: clearLoginErrors,
    formState: { errors: loginErrors, isValid: isLoginValid }
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: 'all'
  });

  const handleLoginSubmit = (data: LoginFormType) => {
    login.mutate(data);
  };

  useEffect(() => {
    clearRegErros();
    clearLoginErrors();
    setWrongLogin('');
  }, [activeTab]);

  return (
    <Stack align='center'>
      <Title>Авторизация</Title>
      <Tabs value={activeTab} onChange={val => setActiveTab(val || '')}>
        <Tabs.List>
          <Tabs.Tab value='login'>Вход</Tabs.Tab>
          <Tabs.Tab value='register'>Регистрация</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Box w='100%' miw={300}>
        {activeTab === 'login' && (
          <form onSubmit={handleSubmitLogin(handleLoginSubmit)}>
            {wrongLogin && (
              <Text color='red' size='sm' mb={10} ta={'center'} fw={600}>
                Введены неверные данные для входа
              </Text>
            )}

            <TextInput
              {...registerLogin('login')}
              mb={10}
              label='Логин'
              placeholder='Например: admin'
              error={loginErrors.login?.message}
              w='100%'
            />

            <PasswordInput
              {...registerLogin('password')}
              mb={0}
              label='Пароль'
              placeholder='Введите пароль'
              error={loginErrors.password?.message}
            />
            <Button disabled={!isLoginValid} fullWidth type='submit' mt={10}>
              Войти
            </Button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleSubmitRegister(handleRegisterSubmit)}>
            {wrongLogin && (
              <Text color='red' size='sm' mb={10} ta={'center'} fw={600}>
                Пользователь с такими данным существует 
              </Text>
            )}
            <TextInput
              {...registerRegister('name')}
              mb={10}
              label='Имя'
              placeholder='Иван'
              error={registerErrors.name?.message}
            />

            <TextInput
              {...registerRegister('surname')}
              mb={10}
              label='Фамилия'
              placeholder='Иванов'
              error={registerErrors.surname?.message}
            />

            <TextInput
              {...registerRegister('login')}
              mb={10}
              label='Логин'
              placeholder='Например: admin'
              error={registerErrors.login?.message}
            />

            <PasswordInput
              {...registerRegister('password')}
              mb={10}
              label='Пароль'
              placeholder='Введите пароль'
              error={registerErrors.password?.message}
            />

            <PasswordInput
              {...registerRegister('confirmPassword')}
              mb={20}
              label='Подтвердите пароль'
              placeholder='Подтвердите пароль'
              error={registerErrors.confirmPassword?.message}
            />

            <Button disabled={!isRegisterValid} fullWidth type='submit'>
              Зарегистрироваться
            </Button>
          </form>
        )}
      </Box>
    </Stack>
  );
};
