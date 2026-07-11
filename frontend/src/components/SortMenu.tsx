import { useState, useRef, useEffect } from 'react'
import './SortMenu.css'
import { ChevronDownIcon } from './icons'

export default function SortMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const SORTS = [
    { key: "updated", label: "更新日順" },
    { key: "created", label: "作成日順" },
    { key: "name", label: "名前順" },
  ]
  const [sort, setSort] = useState(SORTS[0])
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
    <div className="sort-menu" ref={menuRef}>
      <button
        className="sort-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronDownIcon width={24} height={24} />
        {sort.label}
      </button>

      {isOpen && (
        <ul className="sort-menu-list">
          {SORTS.map((s) => (
            <li
              className={s.key === sort.key ? "active" : ""}
              key={s.key}
              onClick={() => {
                setSort(s);
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