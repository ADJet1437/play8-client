export function Testimonials() {
  const videos = [
    { id: 'jb9FaMyg6K8' },
    { id: 'dI0gWNHZThc' },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="rounded-xl shadow-lg overflow-hidden bg-black">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Play8 video ${video.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
