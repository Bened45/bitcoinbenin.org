'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function createAlbum(name, description, coverImage) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data, error } = await supabaseAdmin
    .from('albums')
    .insert({
      name,
      description: description || null,
      cover_image: coverImage || null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création de l'album: ${error.message}`);
  }

  return data;
}

export async function updateAlbumCover(albumId, coverImagePath) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data, error } = await supabaseAdmin
    .from('albums')
    .update({
      cover_image: coverImagePath,
      updated_at: new Date().toISOString()
    })
    .eq('id', albumId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la couverture: ${error.message}`);
  }

  return data;
}

export async function setFirstImageAsCover(albumId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Récupérer la première image de l'album
  const { data: firstImage, error: imageError } = await supabaseAdmin
    .from('gallery_images')
    .select('file_path')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (imageError || !firstImage) {
    throw new Error('Aucune image trouvée dans cet album');
  }

  // Mettre à jour la couverture de l'album
  return await updateAlbumCover(albumId, firstImage.file_path);
}

export async function deleteAlbum(albumId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data: images, error: imagesError } = await supabaseAdmin
    .from('gallery_images')
    .select('file_path')
    .eq('album_id', albumId);

  if (imagesError) {
    throw new Error(`Erreur lors de la récupération des images: ${imagesError.message}`);
  }

  // Supprimer les fichiers du storage
  if (images && images.length > 0) {
    const filePaths = images.map(img => img.file_path);
    const { error: deleteError } = await supabaseAdmin.storage
      .from('gallery')
      .remove(filePaths);

    if (deleteError) {
      console.error('Erreur suppression fichiers:', deleteError);
    }
  }

  // Supprimer les images de la base de données
  const { error: deleteImagesError } = await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('album_id', albumId);

  if (deleteImagesError) {
    throw new Error(`Erreur lors de la suppression des images: ${deleteImagesError.message}`);
  }

  // Supprimer l'album
  const { error } = await supabaseAdmin
    .from('albums')
    .delete()
    .eq('id', albumId);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'album: ${error.message}`);
  }

  return true;
}

export async function deleteImage(imageId, filePath) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Supprimer le fichier du storage
  const { error: storageError } = await supabaseAdmin.storage
    .from('gallery')
    .remove([filePath]);

  if (storageError) {
    console.error('Erreur suppression fichier storage:', storageError);
  }

  // Supprimer l'entrée de la base de données
  const { error } = await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'image: ${error.message}`);
  }

  return true;
}

export async function uploadImage(file, albumId) {
  return addImageToGallery(file, albumId);
}

export async function addImageToGallery(file, albumId) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `gallery/${fileName}`;

    // Upload du fichier
    const { error: uploadError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`❌ Erreur upload: ${uploadError.message}`);
    }

    console.log('✅ Upload réussi!');

    // Insertion dans la base de données
    const { data: imageData, error: insertError } = await supabaseAdmin
      .from('gallery_images')
      .insert({
        title: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type,
        album_id: albumId,
        event_date: new Date().toISOString().split('T')[0],
        tags: ['bitcoin-benin', 'event']
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Erreur insertion: ${insertError.message}`);
    }

    return imageData;

  } catch (error) {
    console.error('Erreur upload image:', error);
    throw error;
  }
}
