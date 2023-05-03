import {
  Fragment,
  PropsWithChildren
} from 'react'

import { Transition } from '@headlessui/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { X } from 'phosphor-react'

import { Heading } from './Heading'
import { Text } from './Text'

export interface ModalRootProps extends PropsWithChildren {
  open?: boolean
  close?: () => void
  className?: string
}

function ModalRoot({
  open = false,
  close,
  children,
  className
}: ModalRootProps) {
  return (
    <DialogPrimitive.Root open={ open } onOpenChange={ close }>

      <Transition.Root show={ open }>
        <Transition.Child
          as={ Fragment }
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPrimitive.Overlay
            forceMount
            className="fixed inset-0 z-20 bg-black/75"
          />
        </Transition.Child>
        <Transition.Child
          as={ Fragment }
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPrimitive.Content
            forceMount
            className={ clsx(
              'fixed z-50 max-h-[100vh] overflow-y-auto overflow-x-hidden',
              'w-[100vw] max-w-md rounded-lg p-4 md:w-full',
              'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
              'bg-white dark:bg-gray-700',
              'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
              className
            ) }
          >

            {children}

            <DialogPrimitive.Close
              className={ clsx(
                'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
                'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
              ) }
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
            </DialogPrimitive.Close>

          </DialogPrimitive.Content>

        </Transition.Child>
      </Transition.Root>

    </DialogPrimitive.Root>
  )
}

ModalRoot.displayName = 'Modal.Root'

function ModalTitle({ children }: PropsWithChildren) {
  return (
    <DialogPrimitive.Title asChild>
      <Heading size="sm">
        {children}
      </Heading>
    </DialogPrimitive.Title>
  )
}

ModalTitle.displayName = 'Modal.Title'

function ModalDescription({ children }: PropsWithChildren) {
  return (
    <DialogPrimitive.Description asChild>
      <Text className="text-slate-400">
        {children}
      </Text>
    </DialogPrimitive.Description>
  )
}

ModalDescription.displayName = 'Modal.Description'

function ModalFooter({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={ clsx('mt-4 flex flex-row-reverse justify-start gap-2', className) }>
      {children}
    </div>
  )
}

ModalFooter.displayName = 'Modal.Footer'

export const Modal = {
  Root: ModalRoot,
  Title: ModalTitle,
  Description: ModalDescription,
  Footer: ModalFooter
}
