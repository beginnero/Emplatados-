import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  Plus,
  Download,
  Upload,
  RotateCcw,
  MoreHorizontal,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNewDish: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onResetDefault: () => void;
  onLogoClick: () => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onNewDish,
  onExport,
  onImport,
  onResetDefault,
  onLogoClick,
}: HeaderProps) {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showToolsMenu) {
      setConfirmingReset(false);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolsMenu]);

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(file);
    e.target.value = '';
    setShowToolsMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-black/8 dark:border-white/8 bg-[#f5f4f0]/90 dark:bg-[#141413]/90 backdrop-blur-md pt-safe">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Zone 1: Clean single-line brand wordmark */}
        <button
          type="button"
          onClick={onLogoClick}
          className="text-lg font-bold tracking-tight text-[#1a1a18] dark:text-[#f0efe8] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Fichas de Cocina
        </button>

        {/* Zone 2: Minimal actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1e1e1c] text-[#6c6c66] dark:text-[#9a9991] hover:text-[#1a1a18] dark:hover:text-[#f0efe8] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            id="btn-header-new-dish"
            type="button"
            onClick={onNewDish}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#1a1a18] dark:bg-[#f0efe8] px-3.5 text-xs sm:text-sm font-medium text-white dark:text-[#1a1a18] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              id="btn-header-menu-tools"
              type="button"
              onClick={() => setShowToolsMenu((prev) => !prev)}
              aria-label="Opciones de carta"
              title="Opciones de carta"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1e1e1c] text-[#6c6c66] dark:text-[#9a9991] hover:text-[#1a1a18] dark:hover:text-[#f0efe8] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showToolsMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#242422] py-1.5 shadow-xl z-50 text-xs animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    onExport();
                    setShowToolsMenu(false);
                  }}
                  className="w-full min-h-[42px] px-3.5 py-2 text-left text-[#1a1a18] dark:text-[#f0efe8] hover:bg-black/4 dark:hover:bg-white/5 flex items-center gap-2.5 font-medium cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#6c6c66] dark:text-[#9a9991]" />
                  <span>Exportar copia (.json)</span>
                </button>

                <label className="w-full min-h-[42px] px-3.5 py-2 text-left text-[#1a1a18] dark:text-[#f0efe8] hover:bg-black/4 dark:hover:bg-white/5 flex items-center gap-2.5 font-medium cursor-pointer">
                  <Upload className="h-4 w-4 text-[#6c6c66] dark:text-[#9a9991]" />
                  <span>Importar archivo (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>

                <div className="my-1 border-t border-black/8 dark:border-white/8" />

                {confirmingReset ? (
                  <div className="px-3.5 py-2 space-y-2">
                    <p className="text-[11px] text-[#6c6c66] dark:text-[#9a9991] leading-snug">
                      Se restaurará la carta oficial original.
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmingReset(false)}
                        className="flex-1 min-h-[36px] rounded-lg border border-black/10 dark:border-white/10 text-[#6c6c66] dark:text-[#9a9991] font-medium cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onResetDefault();
                          setShowToolsMenu(false);
                        }}
                        className="flex-1 min-h-[36px] rounded-lg bg-[#b91c1c] text-white font-medium cursor-pointer"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                    className="w-full min-h-[42px] px-3.5 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/30 text-[#b91c1c] dark:text-red-400 flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Restaurar carta oficial</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
