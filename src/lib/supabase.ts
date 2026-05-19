import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Admin yetkisiyle veri çekebilmek için service_role key kullanıyoruz (Sunucu tarafında güvenlidir)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Next.js derleme (build) sırasında çevre değişkenleri boş olsa bile hata vermemesi için
// veritabanı istemcisini Proxy aracılığıyla yalnızca çalışma zamanında (runtime) ilk kullanımda oluşturuyoruz.
let supabaseInstance: any = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Supabase URL ve Service Role Key eksik! Lütfen Vercel veya yerel .env ayarlarınızı kontrol edin.'
      );
    }
    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseInstance;
}

export const supabase = new Proxy({} as any, {
  get(target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

