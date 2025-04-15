import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUser } from '../api';

import { User } from '$/pages/admin/api';
import { DescInput } from '$/shared/ui/DescInput';
import { Tags } from '$/shared/ui/Tags';

const schema = z.object({
  description: z.string(),
  job: z.string().min(1, 'error')
});

export type ResumeForm = z.infer<typeof schema>;

export const CreateResume = ({ editResume }: { editResume?: Partial<User> }) => {
  const { register, handleSubmit, control, watch, setValue } = useForm<ResumeForm>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      if (editResume) {
        navigate({ to: '/mentor' });
      } else {
        location.reload();
      }
    }
  });

  const onSubmit = (data: ResumeForm) => {
    console.log(tags);
    mutate({
      ...data,
      tags
    });
  };
  const resume = watch('description');
  const work = watch('job');

  useEffect(() => {
    if (!editResume) return;

    setValue('description', editResume?.description || '');
    setValue('job', editResume?.job || '');
    setTags(editResume?.tags || []);
  }, [editResume]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
      <Stack align='center'>
        <DescInput
          title='Резюме'
          placeholder='Распишите ваши главные скиллы и сильные стороны'
          minLength={10}
          maxLength={1500}
          name='description'
          control={control}
        />

        <TextInput
          {...register('job')}
          placeholder='Например: Т-Банк'
          label='Место работы'
          miw={'100%'}
        />

        <Tags selectedTags={tags} setSelectedTags={tags => setTags(tags)} />

        <Stack align='center' maw={'fit-content'}>
          <Button
            type='submit'
            style={{ marginTop: '20px', alignSelf: 'center' }}
            disabled={tags.length === 0 || work.length === 0 || resume.length < 10}>
            {editResume ? 'Сохранить резюме' : 'Создать резюме'}
          </Button>
          {editResume && (
            <Button
              color='red'
              style={{
                alignSelf: 'stretch'
              }}>
              <Link to='/mentor'>Отмена</Link>
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
