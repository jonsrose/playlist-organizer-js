import { useCallback, useEffect } from 'react';

function useObserver(fetchNextPage, hasNextPage, loadMoreRef) {
  const handleObserver = useCallback((entries) => {
    const [target] = entries
    if(target.isIntersecting) {
      fetchNextPage()
    }
  }, [fetchNextPage])

  useEffect(() => {
    if (!loadMoreRef?.current) {
      return;
    }
    
    const element = loadMoreRef.current
    const option = { threshold: 0 }
  
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [fetchNextPage, hasNextPage, handleObserver, loadMoreRef]);
}

export default useObserver;