const WaitlistDetail = ({ params: { slug } }: { params: { slug: string } }) => {
  return (
    <div>
      <h1>Waitlists Detail of {slug}</h1>
    </div>
  );
};

export default WaitlistDetail;
