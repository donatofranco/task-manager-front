import { Category } from '@/types';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getContrastColor, hexToRgba } from '@/utils/color';

export default function SelectCategoria({
  value,
  onChange,
  categories,
  setEditCategoryId,
  setEditCategoryName,
  setEditCategoryColor,
  setIsEditCategoryModalOpen,
  setDeleteCategoryId,
  setIsCreateCategoryModalOpen
}: {
  value: number | null;
  onChange: (id: number | null) => void;
  categories: Category[];
  setEditCategoryId: (id: number | null) => void;
  setEditCategoryName: (name: string) => void;
  setEditCategoryColor: (color: string) => void;
  setIsEditCategoryModalOpen: (open: boolean) => void;
  setDeleteCategoryId: (id: number | null) => void;
  setIsCreateCategoryModalOpen: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = categories.find(c => c.id === value);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      setEditCategoryId(selected.id);
      setEditCategoryName(selected.name);
      setEditCategoryColor(selected.color);
      setIsEditCategoryModalOpen(true);
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      setEditCategoryId(null);
      setDeleteCategoryId(selected.id);
    }
  };

  return (
    <div className="relative w-full mb-4">
      <button
        type="button"
        className="p-2 rounded-2xl w-full shadow-sm shadow-cyan-200 text-center flex items-center justify-between"
        style={{ background: selected ? hexToRgba(selected.color, 0.7) : 'transparent', color: selected ? getContrastColor(selected.color) : '#ededed' }}
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex-1 text-left">{selected ? selected.name : 'Sin categoría'}</span>
        <span className="flex items-center gap-1 ml-2">
          {selected && (
            <>
              <Pencil className="w-4 h-4 hover:text-cyan-300 cursor-pointer" onClick={handleEdit} />
              <Trash2 className="w-4 h-4 hover:text-red-400 cursor-pointer" onClick={handleDelete} />
            </>
          )}
          {open ? <ChevronUp className="w-4 h-4 cursor-pointer" /> : <ChevronDown className="w-4 h-4 cursor-pointer" />}
        </span>
      </button>
      {open && (
        <ul className="absolute z-50 w-full mt-1 rounded-2xl shadow-lg bg-black/80 backdrop-blur p-1 max-h-48 overflow-y-auto">
          <li
            className="p-2 rounded cursor-pointer hover:bg-cyan-800 text-foreground"
            style={{ background: 'transparent', color: '#ededed' }}
            onClick={() => { onChange(null); setOpen(false); }}
          >
            Sin categoría
          </li>
          <li
            className="p-2 rounded cursor-pointer hover:bg-cyan-700 text-cyan-300 font-bold border-b border-cyan-700"
            style={{ background: 'rgba(0,212,243,0.15)' }}
            onClick={() => { setOpen(false); setIsCreateCategoryModalOpen(true); }}
          >
            + Nueva categoría
          </li>
          {categories.map(cat => (
            <li
              key={cat.id}
              className="p-2 rounded cursor-pointer hover:brightness-110"
              style={{
                background: hexToRgba(cat.color, 0.7),
                color: getContrastColor(cat.color)
              }}
              onClick={() => { onChange(cat.id); setOpen(false); }}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
