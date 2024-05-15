const dateFormatter = (dateString: string) => {
  const d = new Date(dateString);
  const mo = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  return `${day} ${mo} ${hour}:${min}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const waitlistData = [
    {
      created_at: "2021-09-01T00:00:00.000Z",
      running_count: 1n,
    },
    {
      created_at: "2021-09-02T00:00:00.000Z",
      running_count: 2n,
    },
    {
      created_at: "2021-09-03T00:00:00.000Z",
      running_count: 3n,
    },
    {
      created_at: "2021-09-04T00:00:00.000Z",
      running_count: 4n,
    },
    {
      created_at: "2021-09-05T00:00:00.000Z",
      running_count: 5n,
    },
    {
      created_at: "2021-09-06T00:00:00.000Z",
      running_count: 6n,
    },
    {
      created_at: "2021-09-07T00:00:00.000Z",
      running_count: 7n,
    },
    {
      created_at: "2021-09-08T00:00:00.000Z",
      running_count: 8n,
    },
  ];

  const res = waitlistData.map((d: any) => ({
    name: dateFormatter(d.created_at),
    running_count: parseInt(d.running_count),
    amount: parseInt(d.running_count),
  }));

  return Response.json(res);
}

export const dynamic = "force-dynamic";
