import {
  startTransition,
  useMemo,
  useState
} from 'react'

import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider
} from '@ariakit/react'
import * as RadixSelect from '@radix-ui/react-select'
import isEmpty from 'lodash/isEmpty'
import { matchSorter } from 'match-sorter'
import {
  Check,
  CaretDown,
  MagnifyingGlass,
  XCircle,
  CircleNotch
} from 'phosphor-react'

import { ActionButton } from '~/components/ActionButton'
import { cn } from '~/utils/cn'

import './styles.css'

export interface SelectOption {
  id: string
  name: string
}

export interface TextInputSelectProps {
  value: string | undefined
  onChange: (value: string) => void
  onSearchChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  options?: SelectOption[]
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
  disabled?: boolean
  maxOptionsToRender?: number
}

export function Select({
  value,
  onChange,
  onSearchChange,
  placeholder,
  searchPlaceholder,
  options = [],
  clearable = false,
  searchable = true,
  loading = false,
  maxOptionsToRender = 10,
  disabled
}: TextInputSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const matches = useMemo(
    () => {
      const selectedOption = options.find((lang) => lang.id === value)

      if (!searchValue) {
        const firstOptions = options.slice(0, maxOptionsToRender)
        if (selectedOption && !firstOptions.includes(selectedOption)) {
          firstOptions.push(selectedOption)
        }
        return firstOptions
      }

      const keys = ['id', 'name']
      const matches = matchSorter(options, searchValue, { keys }).slice(0, maxOptionsToRender)
      if (selectedOption && !matches.includes(selectedOption)) {
        matches.push(selectedOption)
      }
      return matches
    },
    [options, searchValue, value, maxOptionsToRender]
  )

  return (
    <RadixSelect.Root
      value={ value }
      onValueChange={ onChange }
      open={ open }
      onOpenChange={ setOpen }
      disabled={ disabled }
    >
      <ComboboxProvider
        open={ open }
        setOpen={ setOpen }
        resetValueOnHide
        includesBaseElement={ false }
        setValue={ (value) => {
          startTransition(() => {
            setSearchValue(value)
            onSearchChange?.(value)
          })
        } }
      >
        <RadixSelect.Trigger
          className={ cn('flex h-8 flex-1 items-center justify-between text-sm outline-0', {
            'text-gray-100': !!value,
            'text-gray-400': !value
          }) }
        >
          <div>
            <RadixSelect.Value
              className="flex-1 placeholder:text-gray-400"
              placeholder={ placeholder }
            />
            {loading && (
              <RadixSelect.Icon>
                <CircleNotch
                  className="animate-spin text-base text-gray-300 sm:text-lg"
                  weight="bold"
                />
              </RadixSelect.Icon>
            )}
          </div>

          <RadixSelect.Icon>
            <ActionButton type="button" onClick={ () => onChange('') }>
              <CaretDown size={ 20 } className="text-gray-300" />
            </ActionButton>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        {clearable && !!value && (
          <RadixSelect.Icon>
            <ActionButton type="button" onClick={ () => onChange('') }>
              <XCircle size={ 20 } className="text-gray-300" />
            </ActionButton>
          </RadixSelect.Icon>
        )}

        <RadixSelect.Content
          role="dialog"
          position="popper"
          className="select-popover z-50 w-full max-w-96 rounded-lg border-2 border-gray-900 bg-gray-200 shadow-lg"
          sideOffset={ 4 }
          alignOffset={ -16 }
        >
          {searchable && (
            <div className="relative flex items-center p-1 pb-0">
              <div className="pointer-events-none absolute left-3 text-gray-500">
                <MagnifyingGlass size={ 16 } />
              </div>

              <Combobox
                autoSelect
                placeholder={ searchPlaceholder }
                className="h-10 w-full appearance-none rounded bg-gray-200 pl-7 pr-2 text-base text-black outline-2 outline-cyan-600 placeholder:text-gray-500"
                // Ariakit's Combobox manually triggers a blur event on virtually
                // blurred items, making them work as if they had actual DOM
                // focus. These blur events might happen after the corresponding
                // focus events in the capture phase, leading Radix Select to
                // close the popover. This happens because Radix Select relies on
                // the order of these captured events to discern if the focus was
                // outside the element. Since we don't have access to the
                // onInteractOutside prop in the Radix SelectContent component to
                // stop this behavior, we can turn off Ariakit's behavior here.
                onBlurCapture={ (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                } }
              />
            </div>
          )}

          <ComboboxList className="overflow-y-auto p-1">
            {isEmpty(matches) && (
              <span className="select-item text-gray-600">
                Nenhuma opção disponível
              </span>
            )}

            {matches.map(({ id, name }) => (
              <RadixSelect.Item
                key={ id }
                value={ id }
                asChild
                className="select-item truncate"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>{name}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute left-1.5">
                    <Check />
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  )
}
