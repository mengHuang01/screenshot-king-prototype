'use client';

import {
  Check,
  FileText,
  FolderOpen,
  Heart,
  ImagePlus,
  Images,
  Search,
  Upload,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export type PickedPhoto = {
  id: number;
  name: string;
  meta: string;
  tone: string;
  url?: string;
};

type Album = '最近项目' | '截屏' | '文稿' | '收藏';

type LibraryPhoto = PickedPhoto & {
  album: Album;
  caption: string;
  favorite?: boolean;
};

const libraryPhotos: LibraryPhoto[] = [
  { id: 101, name: '产品首页.png', meta: '1170 × 2532 · 1.4 MB', tone: 'sky', album: '截屏', caption: '产品首页', favorite: true },
  { id: 102, name: '聊天记录.png', meta: '1170 × 2532 · 1.1 MB', tone: 'mint', album: '截屏', caption: '聊天记录' },
  { id: 103, name: '数据看板.png', meta: '2048 × 1536 · 1.8 MB', tone: 'indigo', album: '最近项目', caption: '数据看板' },
  { id: 104, name: '订单详情.png', meta: '1170 × 2532 · 980 KB', tone: 'peach', album: '截屏', caption: '订单详情' },
  { id: 105, name: '项目周报.png', meta: '2048 × 2732 · 2.1 MB', tone: 'paper', album: '文稿', caption: '项目周报' },
  { id: 106, name: '旅行清单.png', meta: '1290 × 2796 · 1.3 MB', tone: 'sunset', album: '最近项目', caption: '旅行清单', favorite: true },
  { id: 107, name: '会议纪要.png', meta: '2048 × 2732 · 1.7 MB', tone: 'paper-blue', album: '文稿', caption: '会议纪要' },
  { id: 108, name: '支付结果.png', meta: '1170 × 2532 · 1.0 MB', tone: 'violet-photo', album: '最近项目', caption: '支付结果' },
  { id: 109, name: '收藏页面.png', meta: '1170 × 2532 · 1.2 MB', tone: 'rose', album: '截屏', caption: '收藏页面' },
];

function PhotoArtwork({ photo }: { photo: PickedPhoto }) {
  return (
    <span
      className={`photo-artwork photo-tone-${photo.tone}`}
      style={photo.url ? { backgroundImage: `url(${photo.url})` } : undefined}
      aria-hidden="true"
    >
      {!photo.url ? (
        <>
          <i className="photo-artwork-bar" />
          <i className="photo-artwork-card first" />
          <i className="photo-artwork-card second" />
          <i className="photo-artwork-card third" />
        </>
      ) : null}
    </span>
  );
}

export function PhotoPicker({
  open,
  onOpenChange,
  onPick,
  multiple = true,
  max = 8,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (photos: PickedPhoto[]) => void;
  multiple?: boolean;
  max?: number;
}) {
  const [album, setAlbum] = useState<Album>('最近项目');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const albums: Array<{ id: Album; icon: typeof Images }> = [
    { id: '最近项目', icon: Images },
    { id: '截屏', icon: FolderOpen },
    { id: '文稿', icon: FileText },
    { id: '收藏', icon: Heart },
  ];

  const visiblePhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return libraryPhotos.filter((photo) => {
      const matchesAlbum = album === '最近项目' || (album === '收藏' ? photo.favorite : photo.album === album);
      const matchesQuery = !normalizedQuery || `${photo.name}${photo.caption}`.toLowerCase().includes(normalizedQuery);
      return matchesAlbum && matchesQuery;
    });
  }, [album, query]);

  const togglePhoto = (photoId: number) => {
    setSelectedIds((current) => {
      if (current.includes(photoId)) return current.filter((id) => id !== photoId);
      if (!multiple) return [photoId];
      if (current.length >= max) return current;
      return [...current, photoId];
    });
  };

  const finishPicking = () => {
    const photos = selectedIds
      .map((id) => libraryPhotos.find((photo) => photo.id === id))
      .filter((photo): photo is LibraryPhoto => Boolean(photo));
    if (!photos.length) return;
    onPick(photos);
    setSelectedIds([]);
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSelectedIds([]);
    onOpenChange(nextOpen);
  };

  const importFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const limit = multiple ? max : 1;
    const photos: PickedPhoto[] = Array.from(files).slice(0, limit).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · 本地照片`,
      tone: ['sky', 'mint', 'indigo', 'peach'][index % 4],
      url: URL.createObjectURL(file),
    }));
    onPick(photos);
    setSelectedIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="photo-picker-dialog" showCloseButton={false}>
        <div className="photo-picker-header">
          <DialogClose className="photo-picker-cancel">取消</DialogClose>
          <div>
            <DialogTitle>照片</DialogTitle>
            <DialogDescription>选择要使用的照片</DialogDescription>
          </div>
          <button className="photo-picker-add" disabled={!selectedIds.length} onClick={finishPicking}>
            添加{selectedIds.length ? ` (${selectedIds.length})` : ''}
          </button>
        </div>

        <div className="photo-picker-body">
          <label className="photo-picker-search">
            <Search size={17} />
            <input name="photo-search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索照片…" />
          </label>

          <div className="photo-picker-albums" role="tablist" aria-label="相簿">
            {albums.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} role="tab" aria-selected={album === item.id} className={album === item.id ? 'active' : ''} onClick={() => setAlbum(item.id)}>
                  <Icon size={17} />{item.id}
                </button>
              );
            })}
          </div>

          <div className="photo-picker-section-title">
            <strong>{album}</strong>
            <span>{multiple ? `最多选择 ${max} 张` : '选择 1 张照片'}</span>
          </div>

          <div className="photo-picker-grid">
            {visiblePhotos.map((photo) => {
              const selectedIndex = selectedIds.indexOf(photo.id);
              const selected = selectedIndex >= 0;
              return (
                <button key={photo.id} className={selected ? 'selected' : ''} aria-pressed={selected} aria-label={`${selected ? '取消选择' : '选择'}${photo.caption}`} onClick={() => togglePhoto(photo.id)}>
                  <PhotoArtwork photo={photo} />
                  <span className="photo-picker-check">{selected ? selectedIndex + 1 : <Check size={14} />}</span>
                  <span className="photo-picker-caption">{photo.caption}</span>
                </button>
              );
            })}
            {!visiblePhotos.length ? <div className="photo-picker-empty"><ImagePlus size={30} /><strong>没有找到照片</strong><span>换个关键词试试</span></div> : null}
          </div>
        </div>

        <div className="photo-picker-footer">
          <button onClick={() => fileInputRef.current?.click()}><Upload size={18} />从文件选取</button>
          <span>{selectedIds.length ? `已选择 ${selectedIds.length} 张` : '图片仅在本地处理'}</span>
          <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" multiple={multiple} onChange={(event) => importFiles(event.target.files)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PhotoArtwork };
