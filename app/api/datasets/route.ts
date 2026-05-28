import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../src/lib/supabase';

export async function GET(req: Request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');

  try {
    let marketplaceQuery = supabase.from('marketplace_datasets').select('*');
    let privateQuery = supabase.from('private_vaults').select('*');

    if (owner) {
      marketplaceQuery = marketplaceQuery.eq('wallet_address', owner);
      privateQuery = privateQuery.eq('wallet_address', owner);
    }

    const [marketRes, privateRes] = await Promise.all([marketplaceQuery, privateQuery]);

    const publicDatasets = (marketRes.data || []).map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      category: d.category,
      price_in_ip: d.price_ip.toString(),
      file_size_bytes: parseFloat(d.file_size_mb) * 1024 * 1024,
      ipfs_cid: d.storage_path,
      owner_address: d.wallet_address,
      is_private_vault: false,
      created_at: d.created_at,
      file_format: d.file_format || 'BIN',
      tags: [], ai_tags: [], sample_preview: "Encrypted payload.", price_token: "IP", download_count: 0
    }));

    const privateDatasets = (privateRes.data || []).map(d => ({
      id: d.id,
      name: d.name,
      description: d.name + " (Private Vault)",
      category: 'Private',
      price_in_ip: (d.price_ip || 0).toString(),
      file_size_bytes: parseFloat(d.file_size_mb || 0) * 1024 * 1024,
      ipfs_cid: d.storage_path,
      cdr_vault_uuid: d.vault_uuid,
      owner_address: d.wallet_address,
      is_private_vault: true,
      created_at: d.created_at,
      vault_expiry: d.expires_at,
      subscription_status: d.is_active ? 'active' : 'expired',
      file_format: d.file_format || 'BIN',
      tags: [], ai_tags: [], sample_preview: "Encrypted payload.", price_token: "IP", download_count: 0
    }));

    return NextResponse.json([...publicDatasets, ...privateDatasets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json();
    const { name, category, price_in_ip, description, file_size_bytes, owner_address, is_private_vault, ipfs_cid, cdr_vault_uuid, aes_key, file_format } = body;
    
    if (is_private_vault) {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { data, error } = await supabase.from('private_vaults').insert([{
        wallet_address: owner_address,
        vault_uuid: cdr_vault_uuid,
        name: name,
        storage_path: ipfs_cid,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        aes_key: aes_key,
        price_ip: parseFloat(price_in_ip || '1'),
        file_size_mb: file_size_bytes / (1024 * 1024),
        file_format: file_format || 'BIN'
      }]).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      const { data, error } = await supabase.from('marketplace_datasets').insert([{
        wallet_address: owner_address,
        name: name,
        description: description,
        category: category,
        price_ip: parseFloat(price_in_ip || '0'),
        file_size_mb: file_size_bytes / (1024 * 1024),
        storage_path: ipfs_cid,
        aes_key: aes_key,
        file_format: file_format || 'BIN'
      }]).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
