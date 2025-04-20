'use client';
import { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/lib/api';
import { Category } from '@/types';
import Modal from '@/components/Modal';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Crear
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#00d3f3');

  // Editar
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#00d3f3');

  // Eliminar
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Nuevo estado para ocultar la lista al abrir modal
  const [hideList, setHideList] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cat = await addCategory(newName, newColor);
      setCategories([...categories, cat]);
      setNewName('');
      setNewColor('#00d3f3');
      setIsCreateModalOpen(false);
      setHideList(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;
    try {
      const updated = await updateCategory(editCategory.id, editName, editColor);
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
      setIsEditModalOpen(false);
      setEditCategory(null);
      setHideList(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      setDeleteId(null);
      setHideList(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditCategory(cat);
    setEditName(cat.name);
    setEditColor(cat.color);
    setIsEditModalOpen(true);
    setHideList(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setHideList(true);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[90dvh] w-full text-center">
      {(!hideList) && (
        <>
          <h2 className="text-2xl text-cyan-400 mb-4">Categorías</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            onClick={() => { setIsCreateModalOpen(true); setHideList(true); }}
            className="mb-4 flex items-center gap-2 bg-cyan-500 text-white p-2 rounded-2xl hover:bg-cyan-700 hover:shadow-md hover:shadow-cyan-900 hover:cursor-pointer"
          >
            <Plus /> Nueva Categoría
          </button>
          <ul className="w-[90vw] md:w-[50vw] xl:w-[30vw] space-y-4">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center justify-between p-3 rounded-2xl shadow-sm shadow-cyan-200 backdrop-blur-xs">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-cyan-200">{cat.name}</span>
                </span>
                <span className="flex gap-2">
                  <button onClick={() => handleEditClick(cat)} className="group relative">
                    <Pencil className="text-cyan-600 group-hover:scale-125 transition-all" />
                  </button>
                  <button onClick={() => handleDeleteClick(cat.id)} className="group relative">
                    <Trash2 className="text-red-600 group-hover:scale-125 transition-all" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Crear Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setHideList(false); }}>
        <form onSubmit={handleCreate} className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-2xl mb-4 text-cyan-400">Nueva Categoría</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
            required
            autoFocus
          />
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            className="w-16 h-10 mb-4 mx-auto block border-none"
          />
          <div className="flex justify-evenly">
            <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Check className="absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => { setIsCreateModalOpen(false); setHideList(false); }} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </form>
      </Modal>
      {/* Editar Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setHideList(false); }}>
        <form onSubmit={handleEdit} className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-2xl mb-4 text-cyan-400">Editar Categoría</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
            required
            autoFocus
          />
          <input
            type="color"
            value={editColor}
            onChange={e => setEditColor(e.target.value)}
            className="w-16 h-10 mb-4 mx-auto block border-none"
          />
          <div className="flex justify-evenly">
            <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Check className="absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => { setIsEditModalOpen(false); setHideList(false); }} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </form>
      </Modal>
      {/* Eliminar confirmación */}
      <Modal isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setHideList(false); }}>
        <div className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-xl mb-4 text-cyan-400">¿Eliminar esta categoría?</h2>
          <div className="flex justify-evenly">
            <button onClick={() => deleteId && handleDelete(deleteId)} className="p-4 mr-2 relative group hover:cursor-pointer">
              <Trash2 className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Trash2 className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => { setDeleteId(null); setHideList(false); }} className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-cyan-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-cyan-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
