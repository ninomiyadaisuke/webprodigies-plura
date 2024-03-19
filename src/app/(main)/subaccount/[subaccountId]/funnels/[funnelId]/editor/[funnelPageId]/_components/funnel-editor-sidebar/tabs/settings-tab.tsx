/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client';
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from 'lucide-react';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';

import { useEditor } from '@/providers/editor/editor-provider';

const SettingsTab = () => {
  const { state, dispatch } = useEditor();

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  console.log(state.editor.selectedElement.styles.backgroundImage);

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <Accordion className="w-full" type="multiple">
      <AccordionItem className="px-6 py-0" value="Custom">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === 'link' && !Array.isArray(state.editor.selectedElement.content) && (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">Link Path</p>
              <Input
                id="href"
                onChange={handleChangeCustomValues}
                placeholder="https:domain.example.com/pathname"
                value={state.editor.selectedElement.content.href}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="border-y-[1px] px-6 py-0" value="Typography">
        <AccordionTrigger className="!no-underline">Typography</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'textAlign',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList>
                <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="left">
                  <AlignLeft size={18} />
                </TabsTrigger>
                <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="right">
                  <AlignRight size={18} />
                </TabsTrigger>
                <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="center">
                  <AlignCenter size={18} />
                </TabsTrigger>
                <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="justify">
                  <AlignJustify size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input id="DM Sans" onChange={handleOnChanges} value={state.editor.selectedElement.styles.fontFamily} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Color</p>
            <Input id="color" onChange={handleOnChanges} value={state.editor.selectedElement.styles.color} />
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: 'font-weight',
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a weight" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Font Weights</SelectLabel>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="normal">Regular</SelectItem>
                      <SelectItem value="lighter">Light</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <Input
                id="fontSize"
                onChange={handleOnChanges}
                placeholder="px"
                value={state.editor.selectedElement.styles.fontSize}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem className=" px-6 py-0 " value="Dimensions">
        <AccordionTrigger className="!no-underline">Dimensions</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.height}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      id="width"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.width}
                    />
                  </div>
                </div>
              </div>
              <p>Margin px</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.marginTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      id="marginBottom"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.marginBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      id="marginLeft"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.marginLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      id="marginRight"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.marginRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Padding px</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="paddingTop"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.paddingTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.paddingBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.paddingLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      id="paddingRight"
                      onChange={handleOnChanges}
                      placeholder="px"
                      value={state.editor.selectedElement.styles.paddingRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="px-6 py-0 " value="Decorations">
        <AccordionTrigger className="!no-underline">Decorations</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity === 'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat((state.editor.selectedElement.styles?.opacity || '0').replace('%', '')) || 0}
                %
              </small>
            </div>
            <Slider
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === 'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat((state.editor.selectedElement.styles?.opacity || '0').replace('%', '')) || 0,
              ]}
              max={100}
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'opacity',
                    value: `${e[0]}%%`,
                  },
                });
              }}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius === 'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat((state.editor.selectedElement.styles?.borderRadius || '0').replace('px', '')) || 0}
                px
              </small>
            </div>
            <Slider
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius === 'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat((state.editor.selectedElement.styles?.borderRadius || '0').replace('%', '')) || 0,
              ]}
              max={100}
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'borderRadius',
                    value: `${e[0]}px`,
                  },
                });
              }}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex text-clip rounded-md border-[1px]">
              <div
                className="w-12 "
                style={{
                  backgroundColor: state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                className="mr-2 rounded-none !border-y-0 !border-r-0"
                id="backgroundColor"
                onChange={handleOnChanges}
                placeholder="#HFI245"
                value={state.editor.selectedElement.styles.backgroundColor || ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex text-clip rounded-md border-[1px]">
              <div className="w-12">
                <img alt="" className="h-full object-cover" src={state.editor.selectedElement.styles.backgroundImage} />
              </div>
              <Input
                className="mr-2 rounded-none !border-y-0 !border-r-0"
                id="backgroundImage"
                onChange={handleOnChanges}
                placeholder="url()"
                value={state.editor.selectedElement.styles.backgroundImage || ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'backgroundSize',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex h-fit items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
                <TabsTrigger className="size-10 data-[state=active]:bg-muted" value="cover">
                  <ChevronsLeftRightIcon size={18} />
                </TabsTrigger>
                <TabsTrigger className="size-10 data-[state=active]:bg-muted" value="contain">
                  <AlignVerticalJustifyCenter size={22} />
                </TabsTrigger>
                <TabsTrigger className="size-10 data-[state=active]:bg-muted" value="auto">
                  <LucideImageDown size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="px-6 py-0" value="Flexbox">
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'justifyContent',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex h-fit items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="space-between">
                <AlignHorizontalSpaceBetween size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="space-evenly">
                <AlignHorizontalSpaceAround size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="center">
                <AlignHorizontalJustifyCenterIcon size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="start">
                <AlignHorizontalJustifyStart size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="end">
                <AlignHorizontalJustifyEndIcon size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Label className="text-muted-foreground">Align Items</Label>

          <Tabs
            onValueChange={(e) => handleOnChanges({ target: { id: 'alignItems', value: e } })}
            value={state.editor.selectedElement.styles.alignItems}
          >
            <TabsList className="flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="center">
                <AlignVerticalJustifyCenter size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="flex-start">
                <AlignVerticalJustifyStart size={18} />
              </TabsTrigger>
              <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="flex-end">
                <AlignVerticalJustifyEnd size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Input
              className="size-4"
              id="display"
              onChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'display',
                    value: e.target.checked ? 'flex' : 'block',
                  },
                });
              }}
              placeholder="px"
              type="checkbox"
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              id="flexDirection"
              onChange={handleOnChanges}
              placeholder="px"
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
