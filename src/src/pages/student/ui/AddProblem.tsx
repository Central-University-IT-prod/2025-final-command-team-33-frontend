import { Button, Stack } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Task, getMentors } from '../api';

import { User } from '$/pages/admin/api';
import { API_LINK } from '$/shared/constants';
import { getToken } from '$/shared/lib/token';
import { DescInput } from '$/shared/ui/DescInput';
import { MagicWandIcon } from '$/shared/ui/DescInput/MagicWandIcon';
import { Tags } from '$/shared/ui/Tags';

export const AddProblem = ({
  setMentors,
  setLoading,
  setTask
}: {
  setMentors: React.Dispatch<React.SetStateAction<User[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTask: React.Dispatch<React.SetStateAction<Omit<Task, 'tg' | 'mentorsId'> | null>>;
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const { control, watch, handleSubmit, setValue } = useForm<{ problem: string }>();
  const desc = watch('problem');
  const { mutate } = useMutation({
    mutationKey: ['tags', ...tags],
    mutationFn: () => getMentors(tags),
    onSuccess: data => {
      setLoading(false);
      if (data?.length === 0) {
        toast('Менторы не найдены');
      }
      setMentors(data || []);
    },
    onError: () => {
      setLoading(false);
    }
  });
  const onSubmit = (data: { problem: string }) => {
    setLoading(true);
    mutate();
    setTask({
      tags,
      title: data.problem.slice(0, 30) || '',
      description: data.problem || ''
    });
  };
  const navigate = useNavigate();
  const { mutate: aiText, isPending } = useMutation({
    mutationFn: async () => {
      const resp = await fetch(API_LINK + '/ai/enchant_description/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ description: desc })
      });
      return (await resp.json()) as { description: string };
    },
    onSuccess: d => {
      setValue('problem', d.description);
    }
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button variant='outline' mb={20} onClick={() => navigate({ to: '/student/problems' })}>
        Активные проблемы
      </Button>
      <Stack align='center' w='100%' maw={600} gap={30}>
        <Stack w={'100%'} gap={0}>
          <Button
            w={'fit-content'}
            leftSection={<MagicWandIcon />}
            disabled={(desc?.length || 0) < 10 || isPending}
            onClick={() => aiText()}
            loading={isPending}>
            Улучшить текст
          </Button>
          <DescInput
            title='Проблема'
            placeholder='Например: Не могу составить достойное резюме...'
            minLength={10}
            maxLength={1000}
            control={control}
            name='problem'
          />
        </Stack>
        <Tags selectedTags={tags} setSelectedTags={(tags: string[]) => setTags(tags)} />
        <Button type='submit' color='blue' disabled={(desc || '').length < 10}>
          Найти подходящих менторов
        </Button>
      </Stack>
    </form>
  );
};
