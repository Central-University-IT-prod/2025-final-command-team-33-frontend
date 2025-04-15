import { Badge, Group, Skeleton, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { IconX } from './IconX';

interface TagsProps {
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
}

export const Tags = ({ selectedTags, setSelectedTags }: TagsProps) => {
  const { data: tags, isPending } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.get<string[]>(
        'https://prod-team-33-pafku5n2.REDACTED/api/tags/'
      );
      return response.data;
    }
  });

  return (
    <Stack align='center'>
      <Title>Теги</Title>
      {isPending || !tags ? (
        <Group maw='100%'>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              height={20}
              width={80}
              radius='xl'
              style={{ cursor: 'pointer', padding: '4px 12px' }}
            />
          ))}
        </Group>
      ) : (
        <Group maw='100%'>
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            const variant = isSelected ? 'filled' : 'light';
            const color = isSelected ? 'blue' : 'gray';
            const icon = isSelected ? <IconX /> : null;
            const onClick = () => {
              if (isSelected) {
                setSelectedTags(selectedTags.filter(t => t !== tag));
                return;
              }
              setSelectedTags([...selectedTags, tag]);
            };
            return (
              <Badge
                key={tag}
                color={color}
                variant={variant}
                rightSection={icon}
                onClick={onClick}
                style={{ cursor: 'pointer', padding: '4px 12px' }}>
                {tag}
              </Badge>
            );
          })}
        </Group>
      )}
    </Stack>
  );
};
