// --- NOVO ARQUIVO: src/components/MediaGrid.jsx ---

import React from 'react';
import CardSkeleton from './CardSkeleton';
import Card from './Card'; // Assumindo que Card.jsx existe

const MediaGrid = ({ queryResult, handleCardClick, lastElementRef }) => {
    const { status, data, error, isFetching, isFetchingNextPage } = queryResult;

    if (isFetching && !isFetchingNextPage) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                {[...Array(18)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
        );
    }

    if (status === 'error') {
        return <div className="text-center text-sharkRed mt-20"><p>Erro: {error.message}</p></div>;
    }

    const content = data?.pages.flatMap(page => page.results) || [];

    if (content.length === 0) {
        return <div className="text-center text-gray-400 mt-20"><p>Nenhum item encontrado.</p></div>;
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                {content.map((item, index) => {
                    const isLastElement = content.length === index + 1;
                    return (
                        <div key={`${item.stream_id}-${index}`} ref={isLastElement ? lastElementRef : null}>
                            <Card item={item} onCardClick={handleCardClick} />
                        </div>
                    );
                })}
            </div>
            {isFetchingNextPage && <div className="text-center text-gray-400 py-8"><p>Carregando mais...</p></div>}
        </>
    );
};

export default MediaGrid;