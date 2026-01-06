
export const LoadingShimmer = () => {
  return (
    <div className="animate-pulse flex flex-col h-full w-full bg-white/5 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export const LoadingOverlay = ({ message = "Initializing Network..." }: { message?: string }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
             <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-primary font-mono animate-pulse">{message}</p>
        </div>
    );
}
