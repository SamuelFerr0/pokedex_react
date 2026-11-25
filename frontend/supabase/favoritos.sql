create table if not exists public.favoritos (
  token      uuid        not null,
  pokemon_id integer     not null check (pokemon_id between 1 and 99999),
  criado_em  timestamptz not null default now(),
  primary key (token, pokemon_id)
);

alter table public.favoritos alter column pokemon_id type integer;
alter table public.favoritos drop constraint if exists favoritos_pokemon_id_check;
alter table public.favoritos add constraint favoritos_pokemon_id_check
  check (pokemon_id between 1 and 99999);

alter table public.favoritos enable row level security;
revoke all on public.favoritos from anon, authenticated;

drop function if exists public.listar_favoritos(uuid);

create or replace function public.listar_favoritos(p_token uuid)
returns table (pokemon_id integer)
language sql
stable
security definer
set search_path = public
as $$
  select pokemon_id from public.favoritos where token = p_token order by criado_em;
$$;

create or replace function public.alternar_favorito(p_token uuid, p_pokemon_id integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null then
    raise exception 'token obrigatório';
  end if;

  if exists (select 1 from public.favoritos where token = p_token and pokemon_id = p_pokemon_id) then
    delete from public.favoritos where token = p_token and pokemon_id = p_pokemon_id;
    return false;
  end if;

  insert into public.favoritos (token, pokemon_id) values (p_token, p_pokemon_id) on conflict do nothing;
  return true;
end;
$$;

revoke execute on function public.listar_favoritos(uuid) from public;
revoke execute on function public.alternar_favorito(uuid, integer) from public;
grant execute on function public.listar_favoritos(uuid) to anon, authenticated;
grant execute on function public.alternar_favorito(uuid, integer) to anon, authenticated;

notify pgrst, 'reload schema';
