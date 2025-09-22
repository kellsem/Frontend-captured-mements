
import { useState } from "react"
import { GrMapLocation } from "react-icons/gr"
import { MdAdd, MdClose } from "react-icons/md"

interface TagInputProps {
  tags: string[]
  setTag: React.Dispatch<React.SetStateAction<string[]>>
}

export const TagInput = ({ tags, setTag }: TagInputProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  const addNewTag = () => {
    const value = inputValue.trim()
    if (
      value !== "" &&
      !tags.some(tag => tag.toLowerCase() === value.toLowerCase())
    ) {
      setTag([...tags, value])
      setInputValue("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTag(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addNewTag()
    }
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-2 text-violet-600 bg-violet-200 px-3 py-1 rounded"
            >
              <GrMapLocation className="text-sm" /> {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="text-sm bg-transparent border px-3 rounded outline-none"
          placeholder="Add Location"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded border border-violet-500 hover:bg-violet-500 hover:text-white disabled:opacity-50"
          onClick={addNewTag}
          disabled={inputValue.trim() === "" || tags.some(tag => tag.toLowerCase() === inputValue.trim().toLowerCase())}
          title={inputValue.trim() === "" ? "Digite um local" : tags.some(tag => tag.toLowerCase() === inputValue.trim().toLowerCase()) ? "Local já adicionado" : "Adicionar local"}
        >
          <MdAdd className="text-2xl text-purple-500 hover:text-white" />
        </button>
      </div>
    </div>
  )
}