import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../src/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseAdmin();
  const { id } = await params;
  try {
    const { data: marketData } = await supabase.from('marketplace_datasets').select('*').eq('id', id).maybeSingle();
    
    if (marketData) {
      return NextResponse.json({
        id: marketData.id,
        name: marketData.name,
        description: marketData.description,
        category: marketData.category,
        price_in_ip: marketData.price_ip.toString(),
        file_size_bytes: parseFloat(marketData.file_size_mb) * 1024 * 1024,
        ipfs_cid: marketData.storage_path,
        owner_address: marketData.wallet_address,
        is_private_vault: false,
        created_at: marketData.created_at,
        file_format: marketData.file_format || 'BIN',
        tags: [], ai_tags: [], sample_preview: "Encrypted payload.", price_token: "IP", download_count: 0,
        aes_key: marketData.aes_key
      });
    }

    const { data: privateData } = await supabase.from('private_vaults').select('*').eq('id', id).maybeSingle();
    
    if (privateData) {
      return NextResponse.json({
        id: privateData.id,
        name: privateData.name,
        description: privateData.name + " (Private Vault)",
        category: "Private",
        price_in_ip: (privateData.price_ip || 0).toString(),
        file_size_bytes: parseFloat(privateData.file_size_mb || 0) * 1024 * 1024,
        ipfs_cid: privateData.storage_path,
        cdr_vault_uuid: privateData.vault_uuid,
        owner_address: privateData.wallet_address,
        is_private_vault: true,
        created_at: privateData.created_at,
        vault_expiry: privateData.expires_at,
        subscription_status: privateData.is_active ? 'active' : 'expired',
        file_format: privateData.file_format || 'BIN',
        tags: [], ai_tags: [], sample_preview: "Encrypted payload.", price_token: "IP", download_count: 0,
        aes_key: privateData.aes_key
      });
    }

    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseAdmin();
  const { id } = await params;
  try {
    const { action } = await req.json();
    
    if (action === "renew") {
      const { data: vault, error: fetchErr } = await supabase.from('private_vaults').select('expires_at').eq('id', id).single();
      if (fetchErr) throw fetchErr;

      const currentExpiry = vault.expires_at ? new Date(vault.expires_at) : new Date();
      const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
      baseDate.setFullYear(baseDate.getFullYear() + 1);

      const { data, error } = await supabase.from('private_vaults').update({
        expires_at: baseDate.toISOString(),
        is_active: true
      }).eq('id', id).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
