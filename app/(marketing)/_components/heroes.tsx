import Image from 'next/image';

// Hero Section
const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center gap-10">
                <div className="relative w-[300px] h-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px]">
                    <Image fill className='object-contain' src="/png/homePicture-1.png" alt='homePicture-1' />
                </div>
                <div className="relative w-[400px] h-[400px]  hidden md:block">
                    <Image fill className='object-contain' src="/png/homePicture-2.png" alt='homePicture-2' />
                </div>
            </div>
        </div>
     );
}
 
export default Heroes;