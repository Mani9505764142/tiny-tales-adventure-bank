import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Enforce authorization header check
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If CRON_SECRET is required in production and missing
  if (!cronSecret && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Unauthorized: CRON_SECRET is not configured' },
      { status: 401 }
    );
  }

  const executionTimestamp = new Date().toISOString();

  try {
    // 2. Call the Supabase RPC function
    const { data, error } = await supabase.rpc('process_daily_passive_yields');

    if (error) {
      console.warn('[cron/daily-yields] RPC error or missing function:', error.message);

      // Graceful fallback if RPC function is not yet loaded in Postgres schema cache
      const { data: wallets, error: fetchErr } = await supabase
        .from('child_wallets')
        .select('*');

      if (fetchErr) {
        return NextResponse.json(
          {
            status: 'error',
            error: error.message || fetchErr.message,
            executionTimestamp
          },
          { status: 500 }
        );
      }

      let processedCount = 0;
      if (wallets && wallets.length > 0) {
        for (const w of wallets) {
          const gold = w.gold_coins || 0;
          const land = w.land_coins || 0;
          const goldGain = gold > 0 ? Math.max(1, Math.round(gold * 0.015)) : 0;
          const landGain = land > 0 ? Math.max(1, Math.round(land * 0.017)) : 0;

          if (goldGain > 0 || landGain > 0) {
            await supabase
              .from('child_wallets')
              .update({
                gold_coins: gold + goldGain,
                land_coins: land + landGain,
                updated_at: executionTimestamp
              })
              .eq('id', w.id);

            if (goldGain > 0) {
              await supabase.from('treasury_ledger').insert({
                child_id: w.child_id,
                amount: goldGain,
                description: `🌱 Automated Daily Gold Growth (+1.5%): +${goldGain} coins`,
                category: 'asset_yield'
              });
            }

            if (landGain > 0) {
              await supabase.from('treasury_ledger').insert({
                child_id: w.child_id,
                amount: landGain,
                description: `🌱 Automated Daily Land Growth (+12%/w): +${landGain} coins`,
                category: 'asset_yield'
              });
            }

            processedCount++;
          }
        }
      }

      return NextResponse.json({
        status: 'success',
        walletsProcessed: processedCount,
        executionTimestamp,
        method: 'sync_engine'
      });
    }

    const walletsProcessed =
      typeof data === 'number'
        ? data
        : (data?.wallets_processed ?? data?.count ?? 1);

    return NextResponse.json({
      status: 'success',
      walletsProcessed,
      executionTimestamp,
      data
    });
  } catch (err: any) {
    console.error('[cron/daily-yields] Unexpected execution error:', err);
    return NextResponse.json(
      {
        status: 'error',
        error: err?.message || 'Internal Server Error',
        executionTimestamp
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
