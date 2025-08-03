import React from 'react';
import { useFavorites } from './contexts/FavoritesContext';
import { useQuery } from '@tanstack/react-query';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const StarRating = ({ rating = 0 }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const emptyStars = totalStars - fullStars;
    return (
        <div className="flex text-yellow-400 text-2xl" title={`${rating.toFixed(1)} de 5 estrelas`}>
            {[...Array(fullStars)].map((_, i) => <span key={`f${i}`}>★</span>)}
            {[...Array(emptyStars)].map((_, i) => <span key={`e${i}`} className="text-gray-600">★</span>)}
        </div>
    );
};

const fetchDetails = async ({ queryKey }) => {
    const [_key, item] = queryKey;
    if (!item) return null;

    const tmdbType = item.type === 'series' ? 'tv' : 'movie';
    const url = `https://api.themoviedb.org/3/${tmdbType}/${item.tmdb_id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits,videos`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Não foi possível buscar detalhes no TMDb.');
    }
    return response.json();
};

const DetailsModal = ({ item, onClose, onPlay }) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const isItemFavorite = isFavorite(item.title);

    const { data: details, isLoading, isError } = useQuery({
        queryKey: ['details', item],
        queryFn: fetchDetails,
        enabled: !!item && !!item.tmdb_id && item.tmdb_id !== '0',
    });

    const handleFavoriteClick = () => {
        if (isItemFavorite) {
            removeFavorite(item.title);
        } else {
            addFavorite(item);
        }
    };

    const formattedDetails = details ? {
        title: details.title || details.name,
        overview: details.overview,
        rating: details.vote_average ? details.vote_average / 2 : 0,
        release_date: details.release_date || details.first_air_date,
        genres: details.genres?.map(g => g.name).join(', ') || item.group,
        cast: details.credits?.cast?.slice(0, 5).map(c => c.name).join(', '),
        backdrop_path: details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : null,
        poster_path: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
        trailer_key: details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || null,
    } : null;

    const backdropStyle = formattedDetails?.backdrop_path ? { backgroundImage: `url(${formattedDetails.backdrop_path})` } : {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative w-full h-full max-w-5xl max-h-[85vh] bg-sharkBg bg-cover bg-center rounded-lg shadow-xl overflow-hidden" style={backdropStyle} onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-black bg-opacity-70 md:bg-opacity-60 md:bg-gradient-to-r from-black via-black/80 to-transparent rounded-lg"></div>
                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col md:flex-row gap-8 overflow-y-auto">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <img src={formattedDetails?.poster_path || item.logo} alt={item.title} className="w-full h-auto rounded-md shadow-lg" />
                    </div>
                    <div className="text-white flex flex-col flex-grow">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{formattedDetails?.title || item.title}</h1>
                        {isLoading && <p className="text-gray-400">Carregando detalhes...</p>}
                        {isError && <p className="text-sharkRed">Não foi possível carregar os detalhes.</p>}
                        {formattedDetails ? (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <StarRating rating={formattedDetails.rating} />
                                    {formattedDetails.release_date && <span className="text-gray-300">Lançamento: {new Date(formattedDetails.release_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>}
                                </div>
                                <p className="text-gray-300 mb-4 text-sm md:text-base max-h-32 overflow-y-auto">{formattedDetails.overview || 'Sinopse não disponível.'}</p>
                                <p className="text-sm"><span className="font-bold">Elenco:</span> {formattedDetails.cast || 'Não informado'}</p>
                                <p className="text-sm"><span className="font-bold">Gênero:</span> {formattedDetails.genres || 'Não informado'}</p>
                            </>
                        ) : (
                            !isLoading && <p className="text-gray-400">Detalhes não disponíveis para este título.</p>
                        )}
                        <div className="mt-auto pt-6 flex flex-wrap items-center gap-4">
                            <button onClick={() => onPlay(item)} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 flex items-center gap-2">
                                <span className="text-xl">▶</span> Assistir
                            </button>
                            {formattedDetails?.trailer_key && <button onClick={() => window.open(`https://www.youtube.com/watch?v=${formattedDetails.trailer_key}`, '_blank')} className="border border-white/50 text-white px-6 py-2 rounded font-bold hover:bg-white hover:text-black">Assistir Trailer</button>}
                            <button onClick={handleFavoriteClick} className="border border-white/50 text-white px-6 py-2 rounded font-bold hover:bg-white hover:text-black">{isItemFavorite ? '✓ Favorito' : '+ Favoritos'}</button>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl hover:text-sharkBlue transition-colors z-20">×</button>
            </div>
        </div>
    );
};

export default DetailsModal;