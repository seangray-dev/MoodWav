const Footer = () => {
  return (
    <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
      <p>
        Built by{' '}
        <a
          href='https://www.seangray.tech'
          target='_blank'
          className='font-bold hover:underline'
          rel='noreferrer'>
          Sean Gray
        </a>
      </p>
    </footer>
  );
};

export default Footer;
