import { useState, useRef, useEffect } from 'react'
import './SortMenu.css'
import { ChevronDown } from 'lucide-react'

export type SortKey = "updated" | "created" | "name";

type SortMenuProps = {
  className?: string;
  value?: SortKey;
  onChange?: (sort: SortKey) => void;
};

export default function SortMenu({ className, value, onChange }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const SORTS: { key: SortKey; label: string }[] = [
    { key: "updated", label: "更新日順" },
    { key: "created", label: "作成日順" },
    { key: "name", label: "名前順" },
  ]
  const [internalSort, setInternalSort] = useState<SortKey>(SORTS[0].key)
  const selectedSort: SortKey = value ?? internalSort
  const selectedSortItem: { key: SortKey; label: string } = SORTS.find((s) => s.key === selectedSort) ?? SORTS[0]
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`sort-menu ${className || ''}`} ref={menuRef}>
      <button
        className="sort-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronDown width={24} height={24} />
        {selectedSortItem.label}
      </button>

      {isOpen && (
        <ul className="sort-menu-list">
          {SORTS.map((s) => (
            <li
              className={s.key === selectedSort ? "active" : ""}
              key={s.key}
              onClick={() => {
                if (value === undefined) {
                  setInternalSort(s.key);
                }
                onChange?.(s.key);
                setIsOpen(false);
              }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}