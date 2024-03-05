import { Tag } from '@prisma/client';
import { PlusCircleIcon, TrashIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { deleteTag, getTagsForSubaccount, saveActivityLogsNotification, upsertTag } from '@/lib/queries';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { toast } from '../ui/use-toast';

import TagComponent from './tag';

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
};

const TagColors = ['BLUE', 'ORANGE', 'ROSE', 'PURPLE', 'GREEN'] as const;

export type TagColor = (typeof TagColors)[number];

const TagCreator = ({ subAccountId, getSelectedTags, defaultTags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [getSelectedTags, selectedTags]);

  useEffect(() => {
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getTagsForSubaccount(subAccountId);
        if (response) setTags(response.Tags);
      };
      void fetchData();
    }
  }, [defaultTags, subAccountId]);

  const handleAddTag = async () => {
    if (!value) {
      toast({
        variant: 'destructive',
        title: 'Tags need to have a name',
      });
      return;
    }
    if (!selectedColor) {
      toast({
        variant: 'destructive',
        title: 'Please Select a color',
      });
      return;
    }
    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: v4(),
      name: value,
      subAccountId,
      updatedAt: new Date(),
    };
    setTags([...tags, tagData]);
    setValue('');
    setSelectedColor('');
    try {
      const response = await upsertTag(subAccountId, tagData);
      toast({
        title: 'Created the tag',
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a tag | ${response?.name}`,
        subaccountId: subAccountId,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not create tag',
      });
    }
  };

  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeleteSelection = (tag: Tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
    try {
      const response = await deleteTag(tagId);
      toast({
        title: 'Deleted tag',
        description: 'The tag is deleted from your subaccount.',
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a tag | ${response?.name}`,
        subaccountId: subAccountId,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete tag',
      });
    }
  };

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 rounded-md border-2 border-border bg-background p-2">
            {selectedTags.map((tag) => (
              <div className="flex items-center" key={tag.id}>
                <TagComponent colorName={tag.color} title={tag.name} />
                <X
                  className="cursor-pointer text-muted-foreground"
                  onClick={() => handleDeleteSelection(tag)}
                  size={14}
                />
              </div>
            ))}
          </div>
        )}
        <div className="my-2 flex items-center gap-2">
          {TagColors.map((colorName) => (
            <TagComponent colorName={colorName} key={colorName} selectedColor={setSelectedColor} title="" />
          ))}
        </div>
        <div className="relative">
          <CommandInput onValueChange={setValue} placeholder="Search for tag..." value={value} />
          <PlusCircleIcon
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-all hover:text-primary"
            onClick={handleAddTag}
            size={20}
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                className="flex cursor-pointer items-center justify-between !bg-transparent !font-light hover:!bg-secondary"
                key={tag.id}
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent colorName={tag.color} title={tag.name} />
                </div>
                <AlertDialogTrigger>
                  <TrashIcon
                    className="cursor-pointer text-muted-foreground transition-all  hover:text-rose-400"
                    size={16}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete your the tag and remove it from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive" onClick={() => handleDeleteTag(tag.id)}>
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};

export default TagCreator;
